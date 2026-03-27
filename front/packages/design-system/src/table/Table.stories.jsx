import {Table} from './Table'
import React from 'react'

export default {
  title: 'Components/Table',
}

const queryColumns = [
  {Header: 'Id', accessor: 'id', type: 'number'},
  {Header: 'Name', accessor: 'name', type: 'string'},
  {Header: 'Type', accessor: 'type', type: 'string'},
  {Header: 'Moveset', accessor: 'moveset', type: 'string'},
  {Header: 'HP', accessor: 'hp', type: 'number'},
  {Header: 'Attack', accessor: 'attack', type: 'number'},
  {Header: 'Defense', accessor: 'defense', type: 'number'},
]

const rows = [
  {id: 1, name: 'Bulbasaur', type: 'Grass/Poison', moveset: 'Vine Whip, Tackle', hp: 45, attack: 49, defense: 49},
  {id: 2, name: 'Ivysaur', type: 'Grass/Poison', moveset: 'Vine Whip, Razor Leaf', hp: 60, attack: 62, defense: 63},
  {id: 3, name: 'Venusaur', type: 'Grass/Poison', moveset: 'Vine Whip, Razor Leaf', hp: 80, attack: 82, defense: 83},
  {id: 4, name: 'Charmander', type: 'Fire', moveset: 'Ember, Scratch', hp: 39, attack: 52, defense: 43},
  {id: 5, name: 'Charmeleon', type: 'Fire', moveset: 'Ember, Fire Fang', hp: 58, attack: 64, defense: 58},
  {id: 6, name: 'Charizard', type: 'Fire/Flying', moveset: 'Ember, Fire Fang', hp: 78, attack: 84, defense: 78},
  {id: 7, name: 'Squirtle', type: 'Water', moveset: 'Bubble, Tackle', hp: 44, attack: 48, defense: 65},
  {id: 8, name: 'Wartortle', type: 'Water', moveset: 'Bubble, Water Gun', hp: 59, attack: 63, defense: 80},
  {id: 9, name: 'Blastoise', type: 'Water', moveset: 'Bubble, Water Gun', hp: 79, attack: 83, defense: 100},
  {id: 10, name: 'Caterpie', type: 'Bug', moveset: 'Tackle, Bug Bite', hp: 45, attack: 30, defense: 35},
  {id: 11, name: 'Metapod', type: 'Bug', moveset: 'Harden, Harden', hp: 50, attack: 20, defense: 55},
  {id: 12, name: 'Butterfree', type: 'Bug/Flying', moveset: 'Confusion, Confusion', hp: 60, attack: 45, defense: 50},
  {id: 13, name: 'Weedle', type: 'Bug/Poison', moveset: 'Poison Sting, Poison Sting', hp: 40, attack: 35, defense: 30},
  {id: 14, name: 'Kakuna', type: 'Bug/Poison', moveset: 'Harden, Harden', hp: 45, attack: 25, defense: 50},
  {id: 15, name: 'Beedrill', type: 'Bug/Poison', moveset: 'Poison Jab, Poison Jab', hp: 65, attack: 90, defense: 40},
  {id: 16, name: 'Pidgey', type: 'Normal/Flying', moveset: 'Tackle, Gust', hp: 40, attack: 45, defense: 40},
  {id: 17, name: 'Pidgeotto', type: 'Normal/Flying', moveset: 'Wing Attack, Gust', hp: 63, attack: 60, defense: 55},
  {id: 18, name: 'Pidgeot', type: 'Normal/Flying', moveset: 'Wing Attack, Gust', hp: 83, attack: 80, defense: 75},
  {id: 19, name: 'Rattata', type: 'Normal', moveset: 'Tackle, Quick Attack', hp: 30, attack: 56, defense: 35},
  {id: 20, name: 'Raticate', type: 'Normal', moveset: 'Hyper Fang, Hyper Fang', hp: 55, attack: 81, defense: 60},
  {id: 21, name: 'Spearow', type: 'Normal/Flying', moveset: 'Peck, Peck', hp: 40, attack: 60, defense: 30},
  {id: 22, name: 'Fearow', type: 'Normal/Flying', moveset: 'Drill Peck, Drill Peck', hp: 65, attack: 90, defense: 65},
  {id: 23, name: 'Ekans', type: 'Poison', moveset: 'Poison Sting, Acid', hp: 35, attack: 60, defense: 44},
  {id: 24, name: 'Arbok', type: 'Poison', moveset: 'Acid, Acid', hp: 60, attack: 85, defense: 69},
  {id: 25, name: 'Pikachu', type: 'Electric', moveset: 'Thunder Shock, Quick Attack', hp: 35, attack: 55, defense: 40},
]

export const Default = () => (
  <Table
    columns={queryColumns}
    rows={rows}
  />
)

export const Height = () => (
  <div style={{height: 200}}>
    <Table
      columns={queryColumns}
      rows={rows}
    />
  </div>
)


