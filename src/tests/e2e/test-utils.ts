import { INestApplication, RequestMethod } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../shared';

type OverrideProvider = {
	provide: any;
	useValue: any;
};

class PrismaServiceMock {
	async onModuleInit() {
		return;
	}
}

export async function initTestApp(
	overrides: OverrideProvider[] = [],
): Promise<INestApplication> {
	let builder: TestingModuleBuilder = Test.createTestingModule({
		imports: [AppModule],
	}).overrideProvider(PrismaService)
		.useValue(new PrismaServiceMock());

	for (const override of overrides) {
		builder = builder.overrideProvider(override.provide).useValue(override.useValue);
	}

	const moduleRef = await builder.compile();
	const app = moduleRef.createNestApplication();
	app.setGlobalPrefix('api/v1', {
		exclude: [{ path: '', method: RequestMethod.ALL }],
	});
	await app.init();
	return app;
}

export function closeApp(app?: INestApplication) {
	if (app) {
		return app.close();
	}
	return Promise.resolve();
}

export function serializeDates<T>(value: T): T {
	if (value instanceof Date) {
		return value.toISOString() as unknown as T;
	}

	if (Array.isArray(value)) {
		return value.map((item) => serializeDates(item)) as unknown as T;
	}

	if (value && typeof value === 'object') {
		const entries = Object.entries(value as Record<string, unknown>).map(
			([key, val]) => [key, serializeDates(val)],
		);
		return Object.fromEntries(entries) as T;
	}

	return value;
}

