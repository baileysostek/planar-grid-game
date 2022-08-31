import create from 'zustand'

export const useColorStore = create((set) => ({
    text        : '#FFFCF2',
    background  : '#CCC5B9',
    primary     : '#403D39',
    secondary   : '#252422',
    accent      : '#EB5E28',
}));