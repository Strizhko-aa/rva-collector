interface BageProps {
  text: string;
  color?: 'red' | 'green' | 'blue'; // Опциональный пропс с конкретными значениями
  offset?: {
    top: number;
    left: number;
  }
}

export const Bage = ({ text, color = 'blue', offset }: BageProps) => {
  return (
    <div style={{ 
      position: 'absolute', 
      marginTop: offset?.top || '0', 
      marginLeft: offset?.left || '0', 
      backgroundColor: color, 
      color: 'white', 
      padding: '2px 6px', 
      borderRadius: '4px', 
      fontSize: '12px' 
    }}>
      {text}
    </div>
  )
}