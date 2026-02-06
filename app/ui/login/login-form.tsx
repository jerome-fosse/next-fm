import {SignIn} from "@/app/ui/login/actions";
import {CiUser} from "react-icons/ci";
import { TbLockPassword } from "react-icons/tb";

export default function LoginForm() {
    return (
        <form action={SignIn}>
            <div className="flex items-center m-4">
                <div className="w-1/3">
                    <label htmlFor="login">Login</label>
                </div>
                <div className="w-2/3">
                    <label className="input">
                        <CiUser/>
                        <input id="login" name="login" type="string" placeholder="JohnDoe" />
                    </label>
                </div>
            </div>
            <div className="flex items-center m-4">
                <div className="w-1/3">
                    <label htmlFor="password">Password</label>
                </div>
                <div className="w-2/3">
                    <label className="input">
                        <TbLockPassword />
                        <input id="password" name="password" type="password" placeholder="***************" />
                    </label>
                </div>
            </div>
            <div className="flex items-center m-4">
                <div className="w-1/3"></div>
                <div className="w-2/3 space-x-4">
                    <button type="button" className="btn btn-neutral">Register</button>
                    <button type="submit" className="btn btn-primary">Sign-in</button>
                </div>
            </div>
        </form>
    )
}