import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SetOptionalRequestUserID, SetRequiredRequestUserID } from 'src/persistent/decorators';
import { UseAuthGuard } from 'src/common/auth/auth.guard';

import { LinkService } from './link.service';
import { CreateLinkRequestDTO } from './dto/create-link-request.dto';
import { CreateLinkResponseDTO } from './dto/create-link-response.dto';
import { HitLinkRequestDTO } from './dto/hit-link-request.dto';
import { HitLinkResponseDTO } from './dto/hit-link-response.dto';
import { DeleteLinkRequestDTO } from './dto/delete-link-request.dto';
import { UpdateLinkRequestBodyDTO, UpdateLinkRequestParamDTO } from './dto/update-link-request.dto';
import { GetLinksRequestDTO } from './dto/get-links-request.dto';
import { GetLinksResponseDTO } from './dto/get-links-response.dto';

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

  @Post()
  @UseAuthGuard()
  @SetOptionalRequestUserID()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '링크 생성' })
  @ApiCreatedResponse({ type: CreateLinkResponseDTO })
  async createLink(@Body() body: CreateLinkRequestDTO) {
    return this.linkService.createLink(body);
  }

  @Post('hit')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '링크 접속' })
  @ApiOkResponse({ type: HitLinkResponseDTO })
  async hitLink(@Body() body: HitLinkRequestDTO) {
    return this.linkService.hitLink(body.id);
  }

  @Patch(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '링크 설정 변경' })
  @ApiNoContentResponse()
  async updateLink(@Param() param: UpdateLinkRequestParamDTO, @Body() body: UpdateLinkRequestBodyDTO) {
    return this.linkService.updateLink(param.id, body);
  }

  @Delete(':id')
  @UseAuthGuard()
  @SetRequiredRequestUserID()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '링크 삭제' })
  @ApiNoContentResponse()
  async deleteLink(@Param() param: DeleteLinkRequestDTO) {
    return this.linkService.deleteLink(param.id);
  }
}
