import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Header,
  Icon,
  Image,
  Segment,
} from "semantic-ui-react";
import { openModal } from "../../app/common/modals/modalSlice";

function HomePage() {
    const dispatch = useDispatch();
    const { authenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            style={{ marginBottom: 12 }}
          />
          T-Sentiment
        </Header>
        <Button
          onClick={() => {
            if (authenticated) {
            navigate("/accounts");
            } else {
                dispatch(openModal({modalType: 'LoginForm'}))
            }
          }}
          size='huge'
          inverted
        >
          Get started
          <Icon name='right arrow' inverted />
        </Button>
      </Container>
    </Segment>
  );
}

export default HomePage;
