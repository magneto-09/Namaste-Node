# Related to Namaste Node S02 - Ep 10 - Authentication, Cookies and JWT. 🚀🚀🚀

## TODO - 2 Token Strategy (Access Token + Refresh Token)

**01 - Upon logout we're clearing our authCookie that contains refreshToken.**
But clearing authCookie doesn't ensure the expiry of refreshToken.
We're still dependant on refreshToken natural `expiresIn` time.

What if an attacker get this refreshToken and he generates a new access token for himself.
Although not possible cuz requires REFRESH_TOKEN_JWT_SECRET to verify the stolen refreshToken.

But What if????
We've to implement something that blocks this token once logged out.
Soln. -> Save the token in DB or redis.
         And when logging out so before clearing the cookies remove the token from DB.

         By this, when generating a new access token we've to check if this refreshToken exists or
         not.
         Also, when refreshToken expires naturally so we've to remove this as well from DB.

**02 - Axios Interceptor to generate new access token automatically in the FE Side**
-> Axios interceptor to attach all the req with access token that will be passed as bearer in
req. authorization's headers.

-> Axios interceptor to call the API that generates access token automatically.

**03 - Sending refreshToken by setting httpOnly:true in res.cookie does not guarantee prevention from `CSRF` (Cross-Site Request Forgery) Attack**  
 -> Something related to path, sameStrict options of res.cookie + CSRF Token passed manually from FE Side.
