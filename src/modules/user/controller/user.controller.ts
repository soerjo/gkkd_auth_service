import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUIDParam } from 'src/common/decorator/uuid.decorator';
import { FilterDto } from '../dto/filter.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);

    return {
      message: 'success',
      data: result,
    };
  }

  @Get()
  async findAll(@Query() filterDto: FilterDto) {
    const result = await this.userService.getAll(filterDto);

    return {
      message: 'success',
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') @UUIDParam() id: string) {
    const result = await this.userService.findOne(id);

    return {
      message: 'success',
      data: result,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') @UUIDParam() id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const resutl = await this.userService.update(id, updateUserDto);

    return {
      message: 'success',
      data: resutl,
    };
  }

  @Delete(':id')
  async remove(@Param('id') @UUIDParam() id: string) {
    const result = await this.userService.remove(id);

    return {
      message: 'success',
      data: result,
    };
  }
}
