import { Module } from "@nestjs/common";
import { TestingService } from "./test.service";

@Module({
    providers: [TestingService],
})
export class TestingModule {

}