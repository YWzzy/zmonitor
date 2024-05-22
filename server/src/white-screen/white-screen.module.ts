import { Module } from '@nestjs/common';
import { WhiteScreenService } from './white-screen.service';
import { WhiteScreenController } from './white-screen.controller';

@Module({
  controllers: [WhiteScreenController],
  providers: [WhiteScreenService]
})
export class WhiteScreenModule {}
