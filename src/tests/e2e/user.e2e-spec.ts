import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
	ActivateUserUseCase,
	AuthLoginUseCase,
	CreateUserUseCase,
	DeactivateUserUseCase,
	DeleteUserUseCase,
	FindUserByEmailUseCase,
	FindUserByIdUseCase,
	FindUserByIdentityNumberUseCase,
	FindUserByPhoneUseCase,
	ListDeletedUserUseCase,
	ListUserUseCase,
	ResetPasswordUseCase,
	ResendEmailUseCase,
	RestoreUserUseCase,
	UpdateUserEmailUseCase,
	UpdateUserIdentityNumberUseCase,
	UpdateUserPasswordUseCase,
	UpdateUserPhoneUseCase,
	VerifyEmailUseCase,
} from '../../modules/user-module/usecases';
import { UserEntity } from '../../modules/user-module/entities';
import { UserAdapter } from '../../modules/user-module/adapter';
import { GLOBAL_CONFIG, IdValueObject } from '../../shared';
import { initTestApp, closeApp } from './test-utils';

const FIXED_DATE = new Date('2024-01-01T00:00:00.000Z');
const API_PREFIX = '/api/v1';

jest.setTimeout(20000);

const createUserEntity = (overrides: Partial<HTTP.User.UserDetail> = {}) => {
	return UserEntity.create(
		{
			email: (overrides.email ?? 'john.doe@example.com') as string,
			phone: (overrides.phone ?? '+244900000000') as string,
			identityNumber: (overrides.identity ?? 'ID123456') as string,
			password: overrides.password ?? 'hashed-password',
			isActive: overrides.active ?? true,
			isVerified: overrides.verified ?? true,
			isEmailVerified: overrides.emailVerified ?? true,
			isIdentityVerified: overrides.identityVerified ?? true,
			createdAt: overrides.createdAt ? new Date(overrides.createdAt) : FIXED_DATE,
			updatedAt: overrides.updatedAt ? new Date(overrides.updatedAt) : FIXED_DATE,
			deletedAt: overrides.deletedAt ? new Date(overrides.deletedAt) : null,
		},
		new IdValueObject(overrides.id ?? 'user-1'),
	);
};

const userEntity = createUserEntity();

const userHttp = UserAdapter.toHttp(userEntity);

const expectedUserPayload = {
	...userHttp,
	createdAt: userHttp.createdAt.toISOString(),
	updatedAt: userHttp.updatedAt.toISOString(),
	deletedAt: userHttp.deletedAt,
};

describe('User Module E2E', () => {
	let app: INestApplication | undefined;

	beforeAll(() => {
		GLOBAL_CONFIG.jwtVerifyExp = '3600';
		GLOBAL_CONFIG.jwtVerifySecret = 'verify-secret';
		GLOBAL_CONFIG.jwtAuthExp = '3600';
		GLOBAL_CONFIG.jwtAuthSecret = 'auth-secret';
	});

	afterEach(async () => {
		await closeApp(app);
		app = undefined;
	});

	it('POST /auth/login should return token and user data', async () => {
		const token = 'auth-token';
		const loginMock = {
			execute: jest.fn().mockResolvedValue({ token, user: userEntity }),
		};

		app = await initTestApp([{ provide: AuthLoginUseCase, useValue: loginMock }]);

		const response = await request(app.getHttpServer())
			.post(`${API_PREFIX}/auth/login`)
			.send({ email: 'john.doe@example.com', password: 'secret' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user login done successfuly',
			token,
			user: expectedUserPayload,
		});
		expect(loginMock.execute).toHaveBeenCalledWith({
			ipAddress: expect.any(String),
			data: { email: 'john.doe@example.com', password: 'secret' },
		});
	});

	it('POST /user/create should create a user', async () => {
		const createMock = {
			execute: jest.fn().mockResolvedValue(userEntity),
		};

		app = await initTestApp([{ provide: CreateUserUseCase, useValue: createMock }]);

		const response = await request(app.getHttpServer())
			.post(`${API_PREFIX}/user/create`)
			.send({
				email: 'john.doe@example.com',
				phone: '+244900000000',
				password: 'StrongPass123!',
			})
			.expect(201);

		expect(response.body).toEqual({
			status: true,
			message: 'user created successfuly',
			data: expectedUserPayload,
		});
		expect(createMock.execute).toHaveBeenCalled();
	});

	it('GET /user/list should list active users', async () => {
		const listMock = {
			execute: jest.fn().mockResolvedValue([userEntity]),
		};

		app = await initTestApp([{ provide: ListUserUseCase, useValue: listMock }]);

		const response = await request(app.getHttpServer())
			.get(`${API_PREFIX}/user/list`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			data: [expectedUserPayload],
		});
	});

	it('GET /user/list-deleted should list deleted users', async () => {
		const deletedUser = createUserEntity({ id: 'user-2', deletedAt: FIXED_DATE.toISOString() });
		const listMock = {
			execute: jest.fn().mockResolvedValue([deletedUser]),
		};

		app = await initTestApp([{ provide: ListDeletedUserUseCase, useValue: listMock }]);

		const response = await request(app.getHttpServer())
			.get(`${API_PREFIX}/user/list-deleted`)
			.expect(200);

		const http = UserAdapter.toHttp(deletedUser);
		expect(response.body).toEqual({
			status: true,
			data: [
				{
					...http,
					createdAt: http.createdAt.toISOString(),
					updatedAt: http.updatedAt.toISOString(),
					deletedAt: http.deletedAt?.toISOString(),
				},
			],
		});
	});

	it('POST /user/verify should verify email token', async () => {
		const verifyMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: VerifyEmailUseCase, useValue: verifyMock }]);

		const response = await request(app.getHttpServer())
			.post(`${API_PREFIX}/user/verify`)
			.send({ token: 'verify-token' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'Email verified successfuly',
		});
	});

	it('GET /user/find-by-id/:id should return a user', async () => {
		const findMock = {
			execute: jest.fn().mockResolvedValue(userEntity),
		};

		app = await initTestApp([{ provide: FindUserByIdUseCase, useValue: findMock }]);

		const response = await request(app.getHttpServer())
			.get(`${API_PREFIX}/user/${userEntity.id}`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			data: expectedUserPayload,
		});
	});

	it('GET /user/find-by-email/:email should return a user', async () => {
		const findMock = {
			execute: jest.fn().mockResolvedValue(userEntity),
		};

		app = await initTestApp([{ provide: FindUserByEmailUseCase, useValue: findMock }]);

		const response = await request(app.getHttpServer())
			.get(`${API_PREFIX}/user/find-by-email/john.doe@example.com`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			data: expectedUserPayload,
		});
	});

	it('GET /user/find-by-phone/:phone should return a user', async () => {
		const findMock = {
			execute: jest.fn().mockResolvedValue(userEntity),
		};

		app = await initTestApp([{ provide: FindUserByPhoneUseCase, useValue: findMock }]);

		const response = await request(app.getHttpServer())
			.get(`${API_PREFIX}/user/find-by-phone/%2B244900000000`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			data: expectedUserPayload,
		});
	});

	it('GET /user/find-by-identity-number/:identityNumber should return a user', async () => {
		const findMock = {
			execute: jest.fn().mockResolvedValue(userEntity),
		};

		app = await initTestApp([
			{ provide: FindUserByIdentityNumberUseCase, useValue: findMock },
		]);

		const response = await request(app.getHttpServer())
			.get(`${API_PREFIX}/user/find-by-identity/ID123456`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			data: expectedUserPayload,
		});
	});

	it('PUT /user/update-email/:id should update user email', async () => {
		const updateMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: UpdateUserEmailUseCase, useValue: updateMock }]);

		const response = await request(app.getHttpServer())
			.put(`${API_PREFIX}/user/update-email/${userEntity.id}`)
			.send({ id: userEntity.id, newEmail: 'new.email@example.com' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user email updated successfuly',
		});
	});

	it('PUT /user/update-password/:id should update user password', async () => {
		const updateMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: UpdateUserPasswordUseCase, useValue: updateMock }]);

		const response = await request(app.getHttpServer())
			.put(`${API_PREFIX}/user/update-password/${userEntity.id}`)
			.send({ id: userEntity.id, currentPassword: 'Old1234', newPassword: 'New12345!' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user password updated successfuly',
		});
	});

	it('PUT /user/update-phone/:id should update user phone', async () => {
		const updateMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: UpdateUserPhoneUseCase, useValue: updateMock }]);

		const response = await request(app.getHttpServer())
			.put(`${API_PREFIX}/user/update-phone-number/${userEntity.id}`)
			.send({ id: userEntity.id, newPhone: '+244911111111' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user phone number updated successfuly',
		});
	});

	it('PUT /user/update-identity-number/:id should update identity number', async () => {
		const updateMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([
			{ provide: UpdateUserIdentityNumberUseCase, useValue: updateMock },
		]);

		const response = await request(app.getHttpServer())
			.put(`${API_PREFIX}/user/update-identity-number/${userEntity.id}`)
			.send({ id: userEntity.id, newIdentityNumber: 'ID654321' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user identity number updated successfuly',
		});
	});

	it('POST /user/resend-email should resend verification email', async () => {
		const resendMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: ResendEmailUseCase, useValue: resendMock }]);

		const response = await request(app.getHttpServer())
			.post(`${API_PREFIX}/user/resend-email`)
			.send({ email: 'john.doe@example.com' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'email resended successfuly',
		});
	});

	it('POST /user/reset-password should trigger reset flow', async () => {
		const resetMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: ResetPasswordUseCase, useValue: resetMock }]);

		const response = await request(app.getHttpServer())
			.post(`${API_PREFIX}/user/reset-password`)
			.send({ email: 'john.doe@example.com' })
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'password reseted successfuly',
		});
	});

	it('PUT /user/activate/:id should activate user', async () => {
		const activateMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: ActivateUserUseCase, useValue: activateMock }]);

		const response = await request(app.getHttpServer())
			.put(`${API_PREFIX}/user/activate/${userEntity.id}`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user activated successfuly',
		});
	});

	it('PUT /user/deactivate/:id should deactivate user', async () => {
		const deactivateMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: DeactivateUserUseCase, useValue: deactivateMock }]);

		const response = await request(app.getHttpServer())
			.put(`${API_PREFIX}/user/deactivate/${userEntity.id}`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user deactivated successfuly',
		});
	});

	it('DELETE /user/:id should delete user', async () => {
		const deleteMock = {
			execute: jest.fn().mockResolvedValue(undefined),
		};

		app = await initTestApp([{ provide: DeleteUserUseCase, useValue: deleteMock }]);

		const response = await request(app.getHttpServer())
			.delete(`${API_PREFIX}/user/${userEntity.id}`)
			.expect(200);

		expect(response.body).toEqual({
			status: true,
			message: 'user delete successfuly',
		});
	});

	it('PATCH /user/restore/:id should restore user', async () => {
		const restoredUser = createUserEntity({ deletedAt: null });
		const restoreMock = {
			execute: jest.fn().mockResolvedValue(restoredUser),
		};

		app = await initTestApp([{ provide: RestoreUserUseCase, useValue: restoreMock }]);

		const response = await request(app.getHttpServer())
			.patch(`${API_PREFIX}/user/restore/${userEntity.id}`)
			.expect(200);

		const http = UserAdapter.toHttp(restoredUser);
		expect(response.body).toEqual({
			status: true,
			message: 'User restored successfuly',
			data: {
				...http,
				createdAt: http.createdAt.toISOString(),
				updatedAt: http.updatedAt.toISOString(),
				deletedAt: http.deletedAt,
			},
		});
	});
});

