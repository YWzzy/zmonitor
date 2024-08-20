import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Express } from 'express';

export class ParseBookmarkDto {
    @ApiProperty({
        description: '书签文件',
        type: 'string',
        format: 'binary',
    })
    @IsNotEmpty({ message: '书签文件不能为空' })
    @Type(() => String)
    file: Express.Multer.File;
}
