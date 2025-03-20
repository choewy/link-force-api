import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Request } from 'express';

import { SetOptionalRequestUserID, SetRequiredRequestUserID } from 'src/persistent/decorators';
import { ResponseType } from 'src/persistent/dtos';
import { UseAuthGuard } from 'src/common/auth/auth.guard';

import { LinkService } from './link.service';
import { LinkDTO } from './dto/link.dto';
import { GetLinksRequestDTO } from './dto/get-links-request.dto';
import { GetLinksResponseDTO } from './dto/get-links-response.dto';
import { GetLinkRequestDTO } from './dto/get-link-request.dto';
import { CreateLinkRequestDTO } from './dto/create-link-request.dto';
import { UpdateLinkRequestDTO } from './dto/update-link-request.dto';

@ApiTags('링크')
@Controller('links')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Get()
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @ApiOperation({ summary: '링크 목록 조회' })
  @ApiOkResponse({ type: ResponseType(GetLinksResponseDTO) })
  async getLinks(@Query() queryParam: GetLinksRequestDTO) {
    return this.linkService.getLinks(queryParam);
  }

  @Get(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @ApiOperation({ summary: '링크 조회' })
  @ApiOkResponse({ type: ResponseType(LinkDTO) })
  async getLink(@Param() param: GetLinkRequestDTO) {
    return this.linkService.getLink(param.id);
  }

  @Post()
  @UseAuthGuard()
  @SetOptionalRequestUserID()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '링크 생성' })
  @ApiCreatedResponse({ type: ResponseType(LinkDTO) })
  async createLink(@Body() body: CreateLinkRequestDTO) {
    return this.linkService.createLink(body);
  }

  @Post(':id/hit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '링크 접속' })
  @ApiOkResponse({ type: ResponseType(LinkDTO) })
  async hitLink(@Req() request: Request, @Param() param: GetLinkRequestDTO) {
    return this.linkService.hitLink(request, param.id);
  }

  @Patch(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '링크 설정 변경' })
  @ApiNoContentResponse({ type: ResponseType() })
  async updateLink(@Param() param: GetLinkRequestDTO, @Body() body: UpdateLinkRequestDTO) {
    return this.linkService.updateLink(param.id, body);
  }

  @Delete(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '링크 삭제' })
  @ApiNoContentResponse({ type: ResponseType() })
  async deleteLink(@Param() param: GetLinkRequestDTO) {
    return this.linkService.deleteLink(param.id);
  }
}
