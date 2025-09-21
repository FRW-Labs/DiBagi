import { Module } from "@nestjs/common";
import { ItemController } from "./item.controller";
import { ItemService } from "./item.service";
import { ItemRepository } from "./item.repository";
import { PrismaService } from "src/common/prisma.service";

@Module({
    controllers: [
        ItemController,
    ],
    providers: [
        ItemService,
        ItemRepository,
        PrismaService,
    ],
    exports: [
        ItemRepository,
    ],
})
export class ItemModule {}