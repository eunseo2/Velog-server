import {
  Controller,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { editFileName } from 'src/lib/editFileName';
import { imageFileFilter } from 'src/lib/imageFileFilter';
import { FileService } from './file.service';

type File = {
  originalname: string;
  filename: string;
};

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post(':id')
  @UseInterceptors(
    FilesInterceptor('image', 20, {
      storage: diskStorage({
        destination: './static/files',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadMultipleFiles(@Param('id') Id: number, @UploadedFiles() files) {
    files.forEach(async (file: File) => {
      await this.fileService.Update(Id, file.filename);
    });
    const profile = await this.fileService.getFile(Id);
    return `${profile}`;
  }

  @Patch(':id')
  async deleteProfile(
    @Param('id') Id: number,
  ): Promise<{ statusCode: number }> {
    //기본이미지로 변환
    const deleteProfile = {
      profile: 'https://i.ibb.co/5xqtj6j/2021-04-27-5-45-54.png',
    };
    await this.fileService.deleteProfile(Id, deleteProfile);
    return { statusCode: 200 };
  }
}
