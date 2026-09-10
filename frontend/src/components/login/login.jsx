import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/User.Context";
import { useNavigate } from "react-router-dom";
import { useSweetAlert } from "../../context/SweetAlert2.Context";
import { useLanguage } from "../../context/Language.Context";
import { LANG_CONST } from "../../constants/SelectLang.Constant";
import { isValidEmail, isValidPassword } from "../../helpers/validators.helper";
import { getCurrentUser, loginUser } from "../../helpers/auth.helper";
import Forms from "../body/generalFields/forms/forms";
import Inputs from "../body/generalFields/Inputs/inputs";
import "./login.css";


function Login() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { successSweet, errorSweet } = useSweetAlert();
    const { language } = useLanguage();
    const [isFormValid, setIsFormValid] = useState(false);
    const TEXT = LANG_CONST[language];

    //VALIDATIONS:
    useEffect(() => {
        const validEmail = isValidEmail(email);
        //const validPassword = isValidPassword(password);
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (!email || !password) {
                await errorSweet(`${TEXT.ERROR}: ${TEXT.ERROR_ALL_FIELDS}`);
                return;
            };
            const { user, error, message } = await loginUser(email, password);
            if (error || !user) {
                await errorSweet(`${TEXT.ERROR}: ${TEXT.ERROR_LOGIN_FAIL}`);
                return;
            };
            const { user: freshUser } = await getCurrentUser();
            setUser(freshUser);
            await successSweet(`${TEXT.LOGIN_SUCCESS}!`);
            navigate("/");
        } catch (error) {
            console.error(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
            await errorSweet(`${TEXT.ERROR}: ${error.message}` || TEXT.TEXT_ERROR_OOPS);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleLogin(e);
        };
    };

    return (
        <div className="loginDivCont">
            <section className="loginSectCont">
                <Forms id="loginForm" textTitle={`${TEXT.LOGIN}:`} onSubmit={handleLogin} >
                    <div className="loginFormInputsCont">
                        <Inputs textH2={TEXT.EMAIL} type="email" placeHolder={TEXT.inputsText("m", TEXT.EMAIL)} value={email} onChange={(e) => setEmail(e.target.value)} onKeyPress={handleKeyPress} 
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                        <Inputs textH2={TEXT.PASSWORD} type="password" placeHolder={TEXT.inputsText("m", TEXT.PASSWORD)} value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress} 
                            className={"genFormInput"} cNContainer="genFormInputCont" cNSecTop="genFormInputTopCont" cnSectBottom="genFormInputBottomCont" />
                    </div>
                    <div className="loginFormBtnCont">
                        <a className="btn btn-outline-danger" id="btnLoginHome" href="/">{TEXT.HOME}</a>
                        <button type="submit" className="btn btn-outline-success" id="btnLoginLog" onSubmit={handleLogin}>{TEXT.LOGIN}</button>
                    </div>
                </Forms>
            </section>
        </div>
    );
};

export default Login;