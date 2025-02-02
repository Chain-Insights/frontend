type HeaderProps = {}

export default function Header(/* { isLoggedIn, onLogin, onSignup, onLogout }: HeaderProps */) {
  // const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100">
      <div className="flex items-center">
        <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="w-10 h-10 mr-2" />
        <h1 className="text-xl font-bold">Investment App</h1>
      </div>
      {/* Commenting out the login/signup/logout functionality
      <div>
        {isLoggedIn ? (
          <div className="relative">
            <Button onClick={() => setShowProfileMenu(!showProfileMenu)}>Profile</Button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Button onClick={onLogin} className="mr-2">
              Login
            </Button>
            <Button onClick={onSignup}>Sign Up</Button>
          </div>
        )}
      </div>
      */}
    </header>
  )
}

