import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // CORS 설정 - 프론트엔드에서 백엔드 API 호출 허용
  app.enableCors({
    origin: ['http://localhost:3000'], // Next.js 개발 서버 주소
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
    credentials: true, // 쿠키 전송 허용
  });

  // 백엔드는 3001 포트에서 실행 (Next.js와 포트 충돌 방지)
  const port = 3001;
  await app.listen(port);
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다`);
}
bootstrap();
