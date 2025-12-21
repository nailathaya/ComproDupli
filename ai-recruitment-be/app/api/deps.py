# from fastapi import Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from jose import JWTError, jwt
# from app.core.database import get_db
# from app.models.user import User
# from app.core.security import SECRET_KEY, ALGORITHM
# from fastapi.security import OAuth2PasswordBearer

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         user_id: str = payload.get("sub")

#         if user_id is None:
#             raise HTTPException(status_code=401)

#     except JWTError:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token",
#         )

#     user = db.query(User).filter(User.id == int(user_id)).first()

#     if not user:
#         raise HTTPException(status_code=401)

#     return user