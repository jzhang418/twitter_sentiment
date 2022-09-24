import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";

export default function ErrorComponent() {
    const { error } = useSelector((state) => state.account);

    return (
        <Segment placeholder>
            <Header textAlign="center" content={error?.message || 'Oops - we have an error'} />
            <Button as={Link} to='/accounts' primary sytle={{marginTop: 20}} content='Return to accounts page' />
        </Segment>
    )
}