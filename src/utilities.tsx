export const initialValue = new Array(2_999_999).fill(0).map((_, i) => {
    return {
        id: i,
        isSelected: i === 2_999_999,
    }
});