import React, { useState } from 'react';
import './App.css'

const App = () => {
    const [allTeams, setAllTeams] = useState([]);
    const [groupA, setGroupA] = useState([]);
    const [groupB, setGroupB] = useState([]);
    const [gamesGroupA, setGamesGroupA] = useState([]);
    const [gamesGroupB, setGamesGroupB] = useState([]);
    const [newTeamName, setNewTeamName] = useState('');

    const handleAddTeam = (teamName) => {
        setAllTeams((prevAllTeams) => {
            const updatedTeams = [...prevAllTeams, { name: teamName, wins: 0, losses: 0 }];
            return updatedTeams;
        });
        setNewTeamName('');
    };

    const handleAddWin = (teamName) => {
        setAllTeams((prevAllTeams) => {
            const updatedTeams = prevAllTeams.map((team) => {
                if (team.name === teamName) {
                    return { ...team, wins: team.wins + 1 };
                }
                return team;
            });
            return updatedTeams;
        });
    };

    const handleAddLoss = (teamName) => {
        setAllTeams((prevAllTeams) => {
            const updatedTeams = prevAllTeams.map((team) => {
                if (team.name === teamName) {
                    return { ...team, losses: team.losses + 1 };
                }
                return team;
            });
            return updatedTeams;
        });
    };

    const generateGroups = () => {
        const shuffledTeams = shuffleArray(allTeams);
        const half = Math.ceil(shuffledTeams.length / 2);
        const groupA = shuffledTeams.slice(0, half);
        const groupB = shuffledTeams.slice(half);

        setGroupA(groupA);
        setGroupB(groupB);
    };

    const generateGames = () => {
        const gamesGroupA = generateRoundRobinSchedule(groupA);
        const gamesGroupB = generateRoundRobinSchedule(groupB);

        setGamesGroupA(gamesGroupA);
        setGamesGroupB(gamesGroupB);
    };

    // Функция для перемешивания массива
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Функция для генерации сетки игр между командами одной группы
    const generateRoundRobinSchedule = (teams) => {
        const n = teams.length;
        const groupSize = Math.ceil(n / 2);
        const games = [];

        // Разбиваем команды на две группы
        const groupA = teams.slice(0, groupSize);
        const groupB = teams.slice(groupSize);

        // Генерируем игры для каждого раунда игр
        for (let round = 0; round < n - 1; round++) {
            const roundGames = [];

            // Генерируем игры для текущего раунда игр
            for (let i = 0; i < groupSize; i++) {
                const teamA = groupA[i];
                const teamB = groupB[i];

                roundGames.push(`${teamA.name} vs ${teamB.name}`);
            }

            // Добавляем игры к результату и помещаем команды в новые группы
            games.push(...roundGames);

            const lastTeamA = groupA.pop();
            const firstTeamB = groupB.shift();
            groupA.splice(1, 0, firstTeamB);
            groupB.push(lastTeamA);
        }

        return games;
    };


    return (
        <div className='container'>
            <h2>Список команд</h2>
            <ul>
                {allTeams.map((team, index) => (
                    <li key={index}>
                        <span>{team.name} (Победы: {team.wins}, Поражения: {team.losses})</span>
                        <button onClick={() => handleAddWin(team.name)}>+1 победа</button>
                        <button onClick={() => handleAddLoss(team.name)}>+1 поражение</button>
                    </li>
                ))}
            </ul>

            <div className='second-container'>
                <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
                <button onClick={() => handleAddTeam(newTeamName)}>Добавить команду</button>
                <button onClick={generateGroups}>Сгенерировать группы</button>
                <button onClick={generateGames}>Сгенерировать сетку игр</button>
            </div>

            <div>
                <h2>Группа A</h2>
                <ul>
                    {groupA.map((team, index) => (
                        <li key={index}>{team.name}</li>
                    ))}
                </ul>
                <h2>Группа B</h2>
                <ul>
                    {groupB.map((team, index) => (
                        <li key={index}>{team.name}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Сетка игр группы A</h2>
                <ul>
                    {gamesGroupA.map((game, index) => (
                        <li key={index}>{game}</li>
                    ))}
                </ul>
                <h2>Сетка игр группы B</h2>
                <ul>
                    {gamesGroupB.map((game, index) => (
                        <li key={index}>{game}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
