import {
    IsString,
    IsNotEmpty,
    IsOptional,
    Length,
    IsNumber,
} from 'class-validator';

export class CreateBookmarkDto {
    @IsString()
    @IsNotEmpty({ message: 'UUID 不能为空' })
    @Length(36, 36, { message: 'UUID 长度必须为 36 个字符' })
    uuid: string;

    @IsString()
    @IsNotEmpty({ message: '文件名不能为空' })
    @Length(1, 255, { message: '文件名长度必须在 1 到 255 个字符之间' })
    fileName: string;

    @IsString()
    @IsOptional()
    @Length(36, 36, { message: '父级 UUID 长度必须为 36 个字符' })
    pid?: string;

    @IsString()
    @IsNotEmpty({ message: '标题不能为空' })
    @Length(1, 255, { message: '标题长度必须在 1 到 255 个字符之间' })
    title: string;

    @IsString()
    @IsNotEmpty({ message: 'URL 不能为空' })
    @Length(1, 2083, { message: 'URL 长度必须在 1 到 2083 个字符之间' })
    url: string;

    @IsString()
    created: string;

    @IsString()
    @IsOptional()
    @Length(0, 5000, { message: '图标数据长度必须在 0 到 5000 个字符之间' })
    icon?: string;

    @IsString()
    @IsOptional()
    @Length(0, 255, { message: '描述长度必须在 0 到 255 个字符之间' })
    name?: string;

    @IsString()
    @IsOptional()
    @Length(0, 255, { message: '描述长度必须在 0 到 255 个字符之间' })
    description?: string;

    @IsString()
    @IsOptional()
    @Length(0, 255, { message: '封面长度必须在 0 到 255 个字符之间' })
    cover?: string;

    @IsString()
    @IsOptional()
    @Length(0, 255, { message: '链接长度必须在 0 到 255 个字符之间' })
    href?: string;
}
