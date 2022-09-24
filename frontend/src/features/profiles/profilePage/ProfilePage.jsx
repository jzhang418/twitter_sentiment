import { useDispatch, useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import ProfileContent from "./ProfileContent";
import ProfileHeaderPage from "./ProfileHeader";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useEffect } from "react";
import { getUserProfile } from "../profileSlic";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const { currentUserProfile, loading, error } = useSelector((state) => state.profile);
    const { accounts } = useSelector((state) => state.account);

    useEffect(() => {
        dispatch(getUserProfile('profile'))
    }, [dispatch])

    if ((loading && !currentUserProfile) || (!currentUserProfile && !error)) return <LoadingComponent content="Loading Profile..." />

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeaderPage profile={currentUserProfile} followings={accounts.length}/>
                <ProfileContent profile={currentUserProfile} />
            </Grid.Column>
        </Grid>
    )
}