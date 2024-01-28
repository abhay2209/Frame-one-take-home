import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Community, User } from '../interfaces';
import "./UserCommunityRelationshipManager.css";
import { toast } from 'react-hot-toast';
import Leaderboard from './Leaderboard';
import CircularProgress from '@material-ui/core/CircularProgress';

interface MutationData {
    userId: string;
    communityId: string;
};

function getCommunityNameFromId(communities: Community[], id: string): string {
    const communityName = communities.find((community: Community) => community._id == id);
    return communityName ? communityName.name : "Unknown name";
}

const UserCommunityRelationshipManager = () => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

    const { data: users, isLoading: usersLoading , refetch: refetchUsers} = useQuery({
        queryKey: ['users'],
        queryFn: () => axios.get('http://localhost:8080/user').then(res => res.data)
    });

    const { data: communities, isLoading: communitiesLoading } = useQuery({
        queryKey: ['communities'],
        queryFn: () => axios.get('http://localhost:8080/community').then(res => res.data)
    });

    const joinMutation = useMutation({
        mutationFn: (data: MutationData) => axios.post(`http://localhost:8080/user/${data.userId}/join/${data.communityId}`),
        onSuccess: () => {
            toast.success('Successfully joined the community');
            refetchUsers();
        },
        onError: (error: any) => {
            if (error?.response && error.response?.data) {
                const errorResponse = error.response?.data
                if (errorResponse?.communityId) {
                    toast.error(`${errorResponse.message}${getCommunityNameFromId(communities, errorResponse.communityId)}`)
                } else {
                    toast.error(`Error: ${error.response.data.message}`);
                }
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    });
    const leaveMutation = useMutation({
        mutationFn: (data: MutationData) => axios.delete(`http://localhost:8080/user/${data.userId}/leave/${data.communityId}`),
        onSuccess: () => {
            toast.success('Successfully left the community');
            refetchUsers();
        },
        onError: (error: any) => {
            if (error?.response && error.response?.data) {
                const errorResponse = error.response?.data
                if (errorResponse?.communityId) {
                    toast.error(`${errorResponse.message}${getCommunityNameFromId(communities, errorResponse.communityId)}`)
                } else {
                    toast.error(`Error: ${error.response.data.message}`);
                }
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    });

    const handleJoinClick = () => {
        if (selectedUser && selectedCommunity) {
            joinMutation.mutate({ userId: selectedUser, communityId: selectedCommunity });
        }
    };

    const handleLeaveClick = () => {
        if (selectedUser && selectedCommunity) {
            leaveMutation.mutate({ userId: selectedUser, communityId: selectedCommunity });
        }
    };

    if (usersLoading || communitiesLoading) return <CircularProgress />;

    return (
        <div>
            <label>
                User: &nbsp;
                <select onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">Select User</option>
                    {users.map((user: User) => <option key={user._id} value={user._id}>{user.email}</option>)}
                </select>
            </label>

            <label>
                Community: &nbsp;
                <select onChange={(e) => setSelectedCommunity(e.target.value)}>
                    <option value="">Select Community</option>
                    {communities.map((community: Community) => <option key={community._id} value={community._id}>{community.name}</option>)}
                </select>
            </label>


            <button
                className="join-button"
                onClick={handleJoinClick}
                disabled={!selectedUser || !selectedCommunity}
            >
                Join
            </button>

            <button
                className="leave-button"
                onClick={handleLeaveClick}
                disabled={!selectedUser || !selectedCommunity}
            >
                Leave
            </button>
            <div className={"padding-top-leaderboard"}>
                {(users.length > 0 && users.length > 0) && (
                    <Leaderboard users={users} communities={communities}/>
                )}
           
            </div>
        </div>
    );
};

export default UserCommunityRelationshipManager;