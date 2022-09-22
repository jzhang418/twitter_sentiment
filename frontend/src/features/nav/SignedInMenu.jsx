import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Image, Menu } from "semantic-ui-react";
import { signOutUser } from "../auth/authSlice";

function SignedInMenu() {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.auth);
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      navigate("/");
      dispatch(signOutUser());
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src={currentUser.photoURL || '/assets/user.png'} />
      <Dropdown pointing='top left' text={currentUser.email}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={`/profile/${currentUser.id}`} text='My Profile' icon='user' />
          <Dropdown.Item
            onClick={handleSignOut}
            text='Sing Out'
            icon='power'
          />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
}

export default SignedInMenu;
