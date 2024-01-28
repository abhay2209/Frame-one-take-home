import { Community, User } from "../interfaces";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from '@material-ui/core';
import { useMemo } from 'react';
import {StyledTableRow, BoldTableHeadCell} from './TableStyled';

type LeaderBoardProps = {
    users: User[];
    communities: Community[];
}

interface LeaderboardRow {
    _id: string,
    logo: string | undefined,
    name: string,
    totalExperiencePoints: number,
    numberOfUsers: number
}

/**
 * Component that shos the user leaderboard
 * @param  LeaderBoardProps
 *
 */
const Leaderboard = ({users, communities}: LeaderBoardProps) => { 
    const leaderboardData: LeaderboardRow[] = useMemo(() => {
         const leaderboard: LeaderboardRow[] = communities.map((community) => ({
            _id: community._id,
            logo: community.logo,
            name: community.name,
            totalExperiencePoints: users
              .filter((user) => user.currentCommunityId === community._id)
              .reduce((total, user) => total + (user?.totalExperience ?? 0), 0),
            numberOfUsers: users.filter((user: any) => user.currentCommunityId === community._id).length,
          }));
        
          return leaderboard.sort((first: any, second: any) => second.totalExperiencePoints - first.totalExperiencePoints);
    }, [users, communities]) 

      return (
        <div>
      <h2>Community Leaderboard</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <BoldTableHeadCell>Rank</BoldTableHeadCell>
              <BoldTableHeadCell>Logo</BoldTableHeadCell>
              <BoldTableHeadCell>Name</BoldTableHeadCell>
              <BoldTableHeadCell>Total Experience Points</BoldTableHeadCell>
              <BoldTableHeadCell>Number of Users</BoldTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((community, index) => (
              <StyledTableRow key={community._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <Avatar alt="Community Logo" src={community.logo} />
                </TableCell>
                <TableCell>
                     <strong>{community.name}</strong>
                 </TableCell>
                <TableCell>{community.totalExperiencePoints}</TableCell>
                <TableCell>{community.numberOfUsers}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    )

}

export default Leaderboard;