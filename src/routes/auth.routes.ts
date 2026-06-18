import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router = Router();

router.post('/register/request-otp', AuthController.requestRegisterOtp);
router.post('/register/verify-otp', AuthController.verifyRegisterOtp);

router.post('/login/request-otp', AuthController.requestLoginOtp);
router.post('/login/verify-otp', AuthController.verifyLoginOtp);

router.post('/otp/resend', AuthController.resendOtp);

// TODO: Refresh and Logout
// router.post('/refresh', AuthController.refresh);
// router.post('/logout', AuthController.logout);

export default router;
