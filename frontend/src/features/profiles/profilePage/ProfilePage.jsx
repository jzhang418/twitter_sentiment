import { useDispatch, useSelector } from "react-redux";
import { Grid } from "semantic-ui-react";
import ProfileContent from "./ProfileContent";
import ProfileHeaderPage from "./ProfileHeader";
import useFirestoreDoc from "../../../app/hooks/useFirestoreDoc";
import { getUserProfile } from "../../../app/firestore/firestoreService";
import { listenToProfile } from "../profileSlic";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function ProfilePage() {
    const dispatch = useDispatch();
    const params = useParams();
    const { currentUserProfile, loading, error } = useSelector((state) => state.profile);

    useFirestoreDoc({
        query: () => getUserProfile(params.id),
        data: profile => dispatch(listenToProfile(profile)),
        deps: [params.id, dispatch]
    })

    if ((loading && !currentUserProfile) || (!currentUserProfile && !error)) return <LoadingComponent content="Loading Profile..." />

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeaderPage profile={currentUserProfile} />
                <ProfileContent profile={currentUserProfile} />
            </Grid.Column>
        </Grid>
    )
}