import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import SignedInMenu from "./SignedInMenu";
import SignedOutMenu from "./SignedOutMenu";

function NavBar() {
  const { authenticated } = useSelector((state) => state.auth);

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} to='/' header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: 15 }} />
          T-Sentiment
        </Menu.Item>
        {authenticated ? (
          <>
            <Menu.Item as={NavLink} to='/accounts' name='Accounts' />
            <SignedInMenu />
          </>
        ) : (
          <SignedOutMenu />
        )}
      </Container>
    </Menu>
  );
}

export default NavBar;
