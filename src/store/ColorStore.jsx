import create from 'zustand'

export const useColorStore = create((set) => ({
    text        : '#FFFCF2',
    background  : '#282c34',
    primary     : '#403D39',
    secondary   : '#252422',
    accent      : '#EB5E28',

    red         : '#BC4B51',
    orange      : '#F4A259',
    yellow      : '#F4E285',
    green       : '#5B8E7D',
    blue        : '#8Cb369',

    DEFAULT_COLOR : "#282c34",
    
}));