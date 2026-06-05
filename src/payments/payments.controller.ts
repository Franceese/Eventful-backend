import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Get, Param } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
  ) {}

  @Post('initialize')
  @UseGuards(JwtGuard)
  initializePayment(
    @Req() req: any,
    @Body() body: InitializePaymentDto,
  ) {
    return this.paymentsService.initializePayment(
      req.user,
      body.eventId,
    );
  }

  @Get('verify/:reference')
@UseGuards(JwtGuard)
verifyPayment(
  @Param('reference') reference: string,
) {
  return this.paymentsService.verifyPayment(
    reference,
  );
}

@Get('analytics')
@UseGuards(JwtGuard, RolesGuard)
@Roles('CREATOR')
getCreatorPayments(@Req() req: any) {
  return this.paymentsService.getCreatorPayments(
    req.user,
  );
}
}