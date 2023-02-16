import Logout from "./Logout";
import SuccessView from "./SuccessView";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/passwordless";
import SuperTokens from "supertokens-react-native";
import EmailVerification from "supertokens-auth-react/recipe/emailverification";
import Session from "supertokens-auth-react/recipe/session";

// TODO: This screen needs to be more professional
export default function Home2() {
    let sessionContext = useSessionContext();
    const navigate = useNavigate();

    async function logoutClicked() {
        await SuperTokens.signOut();
        navigate("/auth");
    }

    if (sessionContext.loading === true) {
        return null;
    }

    return (
        <div className="fill">
            <Logout logoutClicked={logoutClicked} />
            <SuccessView userId={sessionContext.userId} />
        </div>
    );
}
