package middleware

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(jwtSecret string) gin.HandlerFunc {

    return func(c *gin.Context) {

        authHeader := c.GetHeader("Authorization")

        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{
                "error": "Authorization token required",
            })
            c.Abort()
            return
        }

        parts := strings.SplitN(authHeader, " ", 2)

        if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
            c.JSON(http.StatusUnauthorized, gin.H{
                "error": "Invalid authorization header",
            })
            c.Abort()
            return
        }

        tokenString := parts[1]

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, jwt.ErrSignatureInvalid
            }

            return []byte(jwtSecret), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{
                "error": "Invalid or expired token",
            })
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)

        if !ok {
            c.JSON(http.StatusUnauthorized, gin.H{
                "error": "Invalid token claims",
            })
            c.Abort()
            return
        }

        userID, userOK := claims["user_id"].(string)
        role, roleOK := claims["role"].(string)

        if !userOK || !roleOK || userID == "" {
            c.JSON(http.StatusUnauthorized, gin.H{
                "error": "Invalid user information",
            })
            c.Abort()
            return
        }

        c.Set("user_id", userID)
        c.Set("role", role)

        c.Next()
    }
}

func AdminOnly() gin.HandlerFunc {

    return func(c *gin.Context) {

        role, exists := c.Get("role")

        if !exists || role != "Admin" {
            c.JSON(http.StatusForbidden, gin.H{
                "error": "Admin access required",
            })
            c.Abort()
            return
        }

        c.Next()
    }
}