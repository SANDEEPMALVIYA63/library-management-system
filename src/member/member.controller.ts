import {
  Controller,
  Patch,
  Post,
  Req,
  ParseIntPipe,
  Param,
  Get,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MemberService } from './member.service';
import {
  AuthenticatedRequest,
  BaseController,
  RolesGuard,
  AccessGuard,
  JwtAuthGuard,
  Roles,
  UserType,
} from '@Common';
import { AddMemberDto, UpdateMemberDto } from './dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
@ApiTags('Member')
@ApiBearerAuth()
@Roles(UserType.USER)
@UseGuards(JwtAuthGuard, AccessGuard, RolesGuard)
@Controller('member')
export class MemberController extends BaseController {
  constructor(private readonly memberService: MemberService) {
    super();
  }

  @Post()
  @ApiBody({ type: AddMemberDto })
  async addMember(@Req() req: AuthenticatedRequest, @Body() dto: AddMemberDto) {
    const ctx = this.getContext(req);
    return this.memberService.addMember(ctx.user, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update Member' })
  async updateMember(
    @Param('id', ParseIntPipe) memberId: number,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateMemberDto,
  ) {
    const ctx = this.getContext(req);
    return this.memberService.udateMember(ctx.user, memberId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get member by id' })
  async getMemberById(
    @Param('id', ParseIntPipe) memberId: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const ctx = this.getContext(req);
    return this.memberService.findById(ctx.user, memberId);
  }

  @Get()
  @ApiOperation({ summary: 'get all member  list ' })
  async getAllMember(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return this.memberService.findAllMember(ctx.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete member' })
  async deleteMember(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) memberId: number,
  ) {
    const ctx = this.getContext(req);
    return this.memberService.deleteMember(ctx.user, memberId);
  }
}
