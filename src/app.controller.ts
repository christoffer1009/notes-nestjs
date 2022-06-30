import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Note as NoteModel } from '@prisma/client';
import { NoteService } from './note.service';

@Controller()
export class AppController {
  constructor(private readonly noteService: NoteService) {}

  @Get('/notes/:id')
  async getNoteById(@Param('id') id: string): Promise<NoteModel> {
    return this.noteService.note({ id: Number(id) });
  }

  @Get('notes')
  async getNotes(): Promise<NoteModel[]> {
    return this.noteService.notes({});
  }

  @Get('filtered-notes/:searchString')
  async getFilteredNotes(
    @Param('searchString') searchString: string,
  ): Promise<NoteModel[]> {
    return this.noteService.notes({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            text: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('notes')
  async createDraft(
    @Body() noteData: { title: string; text?: string },
  ): Promise<NoteModel> {
    const { title, text } = noteData;
    return this.noteService.createNote({
      title,
      text,
    });
  }

  @Put('notes/:id')
  async updateNote(
    @Param('id') id: string,
    @Body() noteData: { title: string; text?: string },
  ): Promise<NoteModel> {
    const { title, text } = noteData;
    return this.noteService.updateNote({
      where: { id: Number(id) },
      data: { title, text },
    });
  }

  @Delete('notes/:id')
  async deleteNote(@Param('id') id: string): Promise<NoteModel> {
    return this.noteService.deleteNote({ id: Number(id) });
  }
}
