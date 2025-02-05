import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Grid2 as Grid,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { setUsers } from "../../store/userSlice";
import { IRandomuserResponseDto, IUserDto } from "../../types/types";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  const [search, setSearch] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    console.log("users", users);

    if (users.length === 0) {
      axios
        .get<IRandomuserResponseDto>("https://randomuser.me/api/?results=10")
        .then((response) => dispatch(setUsers([...response.data.results])))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [dispatch, users]);

  const filteredUsers = users.filter(
    (user: IUserDto) =>
      `${user.name.first} ${user.name.last}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const countryCount = users.reduce(
    (acc: Record<string, number>, user: IUserDto) => {
      acc[user.location.country] = (acc[user.location.country] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = {
    labels: Object.keys(countryCount),
    datasets: [
      {
        data: Object.values(countryCount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#8BC34A",
          "#FF9800",
        ],
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{users.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8, sm: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Users by Country</Typography>
              <Pie data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TextField
        label="Search Users"
        variant="outlined"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Grid container spacing={2}>
        {filteredUsers.map((user: IUserDto, index: number) => (
          <Grid size={{ xs: 12, md: 4, sm: 6 }} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={user.picture.medium}
                    alt={user.name.first}
                    sx={{ width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {user.name.first} {user.name.last}
                    </Typography>
                    <Typography variant="body2">{user.email}</Typography>
                    <Typography variant="body2">
                      {user.location.country}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() =>
                        setExpandedUser(
                          expandedUser === user.email ? null : user.email
                        )
                      }
                    >
                      {expandedUser === user.email
                        ? "Hide Details"
                        : "Show Details"}
                    </Button>
                  </Box>
                </Box>
                <Collapse in={expandedUser === user.email}>
                  <Box mt={2}>
                    <Typography variant="body2">Phone: {user.phone}</Typography>
                    <Typography variant="body2">
                      Address: {user.location.street.number}{" "}
                      {user.location.street.name}, {user.location.city},{" "}
                      {user.location.state}, {user.location.postcode}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
