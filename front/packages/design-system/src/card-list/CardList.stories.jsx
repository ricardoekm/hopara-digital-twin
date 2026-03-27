import React from 'react'

import {CardList} from './CardList'
import {CardListItem} from './CardListItem'

export default {
    title: 'Organization/Card List/CardList',
    component: CardList,
}

export const Large = () => <CardList>
    <CardListItem name="Item1"/>
    <CardListItem name="Item2"/>
    <CardListItem name="Item3"/>
    <CardListItem name="Item4"/>
    <CardListItem name="Item5"/>
    <CardListItem name="Item6"/>
    <CardListItem name="Item7"/>
    <CardListItem name="Item8"/>
</CardList>

export const Small = () => <CardList>
    <CardListItem name="Item1" size="small"/>
    <CardListItem name="Item2" size="small"/>
    <CardListItem name="Item3" size="small"/>
    <CardListItem name="Item4" size="small"/>
    <CardListItem name="Item5" size="small"/>
    <CardListItem name="Item6" size="small"/>
    <CardListItem name="Item7" size="small"/>
    <CardListItem name="Item8" size="small"/>
</CardList>

