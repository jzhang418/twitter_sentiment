import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Dropdown, Image, Menu } from "semantic-ui-react";
import { signOutFirebase } from "../../app/firestore/firebaseService";

function SignedInMenu() {
  const {currentUser} = useSelector(state => state.auth);
  const navigate = useNavigate();

  async function handleSignOut() {
    try {
      navigate("/");
      await signOutFirebase();
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src={currentUser.photoURL || '/assets/user.png'} />
      <Dropdown pointing='top left' text={currentUser.email}>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to={`/profile/${currentUser.uid}`} text='My Profile' icon='user' />
          <Dropdown.Item as={Link} to='/changepassword' text='Change Password' icon='setting' />
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
