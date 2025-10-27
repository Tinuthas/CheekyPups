import { AxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/roundedlogo.png'
import z, { ZodError } from 'zod'
import { api, updateToken } from '../lib/axios';
import { Loading } from '../components/Loading';

interface Token {
  accessToken: string;
}

const loginSchema = z.object({
  parsedEmail: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string'
  }).email({ message: "Invalid email address" }),
  parsedPassword: z.string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  }).min(6, { message: "Password must be 6 or more characters long" }),
})

type LoginInput = z.infer<typeof loginSchema>

export function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false)
  const [authenticated, setauthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || "")
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setErrorMessage("")

    if (email == '' || password == '') {
      setErrorMessage("You need to fill in the email and password fields")
      return
    }

    try {
      login(loginSchema.parse({ parsedEmail: email, parsedPassword: password }))
    } catch (err: any) {
      const validation: ZodError = err
      var listMessage = ""
      validation.errors.map(error => {
        if (listMessage != "")
          listMessage = listMessage + " - "
        listMessage = listMessage + error.message
      })
      setErrorMessage(listMessage)
    }


  }

  function login(input: LoginInput) {
    setLoading(true)
    const { parsedEmail, parsedPassword } = input
    api.post<Token>('users/login', { email: parsedEmail, password: parsedPassword }, {
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      var accessToken = response.data.accessToken
      setLoading(false)
      if (accessToken != "") {
        localStorage.setItem("authenticated", accessToken);
        updateToken()
        navigate("/app");
      }

    }).catch((err: AxiosError) => {
      setLoading(false)
      if (err.response?.status == 401) {
        setErrorMessage("Invalid email or password")
        return
      } else {
        setErrorMessage("Unidentified error")
        return
      }
    })
  }

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-3xl shadow-md lg:max-w-xl">
        <div className='flex justify-center m-6'>
          <img src={logoImage} alt="Cheeky Pubs Logo" className='h-[100px] md:h-[150px]' />
        </div>
        <h3 className="text-4xl md:text-5xl font-semibold text-center text-pinkBackground font-borsok">
          Sign in
        </h3>
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-neutral-800"
            >
              Email
            </label>
            <input
              onChange={event => setEmail(event.target.value)}
              autoFocus
              type="email"
              className="block w-full px-4 py-2 mt-2 text-neutral-600 bg-white border rounded-md focus:border-pinkBackground focus:outline-none"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-neutral-800"
            >
              Password
            </label>
            <input
              onChange={event => setPassword(event.target.value)}
              type="password"
              className="block w-full px-4 py-2 mt-2 text-neutral-600 bg-white border rounded-md focus:border-pinkBackground focus:outline-none "
            />
          </div>

          <div className={`mt-6 ${errorMessage !== "" ? 'opacity-100' : 'hidden opacity-0'}`}>
            <span className='text-red-500 font-semibold text-base'>{errorMessage}</span>
          </div>

          <div className="mt-6">
            {loading ? <div className="w-full flex justify-center"><Loading pink={true} /> </div> :
              <button className="w-full px-4 py-2 font-bold tracking-wide text-white transition-colors duration-200 transform bg-pinkBackground rounded-md hover:bg-pink-600 focus:outline-none focus:bg-bg-pink-600">
                Login
              </button>
            }
          </div>
        </form>


      </div>
    </div>
  );
}

/*

<a
                    href="#"
                    className="text-xs text-purple-600 hover:underline"
                >
                    Forget Password?
                </a>

 <p className="mt-8 text-xs font-light text-center text-gray-700">
                {" "}
                Don't have an account?{" "}
                <a
                    href="#"
                    className="font-medium text-purple-600 hover:underline"
                >
                    Sign up
                </a>
            </p>

*/