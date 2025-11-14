import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initTestApp, closeApp } from './test-utils';

jest.setTimeout(20000);

describe('AppController (E2E)', () => {
	let app: INestApplication | undefined;

	afterEach(async () => {
		await closeApp(app);
		app = undefined;
	});

	it('GET / should render index page', async () => {
		app = await initTestApp();

		await request(app.getHttpServer())
			.get('/')
			.expect(200)
			.expect('Content-Type', /html/);
	});
});

