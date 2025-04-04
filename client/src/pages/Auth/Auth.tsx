import AuthForm from '../../components/AuthForm/AuthForm';

type AuthProps = {
    isSignIn: boolean;
};

export default function Auth({ isSignIn }: AuthProps) {
    return <AuthForm isSignIn={isSignIn} />;
}
