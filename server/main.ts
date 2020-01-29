import { NestFactory } from "@nestjs/core";
import { Controller, Get } from "@nestjs/common";
import { Module } from "@nestjs/common";
import Vue from "vue";
import { createRenderer } from "vue-server-renderer";

declare const module: {
  hot: {
    accept: Function;
    dispose: Function;
  };
};

@Controller()
class AppController {
  @Get()
  async getHello(): Promise<string> {
    const app = new Vue({
      data(): object {
        return {
          msg: "Hello World!"
        };
      },
      template: `<h1>{{this.msg}}</h1>`
    });
    const html = await createRenderer().renderToString(app);
    return html;
  }
}

@Module({
  controllers: [AppController]
})
class AppModule {}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
