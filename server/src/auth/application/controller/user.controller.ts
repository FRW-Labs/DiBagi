import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags("User")
@Controller("users")
export class UserController {

}