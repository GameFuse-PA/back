import {
    Body,
    Controller,
    Get,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UsersService } from '../users/users.service';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { NewPasswordDto } from './dto/newPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.signIn(loginDto);
    }

    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto);
    }

    @UseGuards(AuthGuard)
    @Get('me')
    me(@Request() req) {
        return this.usersService.findOneById(req.userId);
    }
    @Post('forgot-password')
    sendResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.sendResetPasswordEmail(resetPasswordDto);
    }

    @Put('password')
    @UseGuards(AuthGuard)
    resetPassword(@Request() req, @Body() newPasswordDto: NewPasswordDto) {
        const token = req.headers.authorization.split(' ')[1];
        return this.authService.resetPassword(
            req.userId,
            token,
            newPasswordDto,
        );
    }
}
