import '../../src/api/accounts/ForgotPassword.test'
import '../../src/api/accounts/GetProfile.test'
import '../../src/api/accounts/PasswordChangeToken.test'
import '../../src/api/accounts/utils/utils.test'
import '../../src/api/health/GetHealth.test'
import '../../src/api/tokens/CreateToken.test'
import '../../src/decorators/injectDao/injectDao.test'
import '../../src/emails/forgotPassword.test'
import '../../src/emails/verify.test'
import '../../src/extensions/Error.test'
import '../../src/feature-toggles/configure-koa-handler.test'
import '../../src/loadConfiguration.test'
import '../../src/middlewares/authorization.test'
import '../../src/middlewares/isLoggedIn.test'
import '../../src/middlewares/monitor.test'
import '../../src/middlewares/rateLimit.test'
import '../../src/middlewares/requireApiToken.test'
import '../../src/middlewares/requireEmailVerified.test'
import '../../src/middlewares/validate.test'
import '../../src/modules/Accounts/Accounts.hooks.test'
import '../../src/securityHeaders.test'
import '../../src/utils/Delay/Delay.test'
import '../../src/utils/Logging/Logging.test'
import '../../src/utils/Password/Password.test'
import '../../src/utils/Password/isPwned.test'
