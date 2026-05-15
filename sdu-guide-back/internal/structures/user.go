package structures

import "time"

type UserRegister struct {
	Login    string `json:"login"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type User struct {
	ID               uint64    `json:"_id,omitempty"`
	Username         string    `json:"username"`
	Email            string    `json:"email"`
	PasswordHash     string    `json:"-"`
	FirstName        string    `json:"firstName"`
	LastName         string    `json:"lastName"`
	RegistrationDate time.Time `json:"registrationDate"`
	LastLogin        time.Time `json:"lastLogin"`
	ImageHash        string    `json:"imageHash"`
}

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Session struct {
	ID          int
	UserID      int
	Token       string
	ExpiredDate time.Time
}

type UpdateUser struct {
	Username  *string `json:"username"`
	Email     *string `json:"email"`
	FirstName *string `json:"firstName"`
	LastName  *string `json:"lastName"`
	Age       *int    `json:"age"`
	Gender    *string `json:"gender"`
	ImageHash *string `json:"imageHash"`
}
