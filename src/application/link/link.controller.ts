import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SetOptionalRequestUserID, SetRequiredRequestUserID } from 'src/persistent/decorators';
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
  @ApiOkResponse({ type: GetLinksResponseDTO })
  async getLinks(@Query() queryParam: GetLinksRequestDTO) {
    return this.linkService.getLinks(queryParam);
  }

  @Get(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @ApiOperation({ summary: '링크 조회' })
  @ApiOkResponse({ type: LinkDTO })
  async getLink(@Param() param: GetLinkRequestDTO) {
    return this.linkService.getLink(param.id);
  }

  @Post()
  @UseAuthGuard()
  @SetOptionalRequestUserID()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '링크 생성' })
  @ApiCreatedResponse({ type: LinkDTO })
  async createLink(@Body() body: CreateLinkRequestDTO) {
    return this.linkService.createLink(body);
  }

  @Post(':id/hit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '링크 접속' })
  @ApiOkResponse({ type: LinkDTO })
  async hitLink(@Param() param: GetLinkRequestDTO) {
    return this.linkService.hitLink(param.id);
  }

  @Patch(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '링크 설정 변경' })
  @ApiNoContentResponse()
  async updateLink(@Param() param: GetLinkRequestDTO, @Body() body: UpdateLinkRequestDTO) {
    return this.linkService.updateLink(param.id, body);
  }

  @Delete(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '링크 삭제' })
  @ApiNoContentResponse()
  async deleteLink(@Param() param: GetLinkRequestDTO) {
    return this.linkService.deleteLink(param.id);
  }
}
