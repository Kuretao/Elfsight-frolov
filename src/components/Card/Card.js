import { StyledCard, CardImg, CardInfo } from './styles';
import { CardTitle } from './CardTitle';
import { CardStatus } from './CardStatus';

export function Card({
  status,
  name,
  species,
  type,
  gender,
  image,
  onClickHandler
}) {
  return (
    <StyledCard onClick={onClickHandler}>
      <CardImg src={image} alt={name} />
      <CardInfo>
        <CardTitle name={name} gender={gender} />
        <CardStatus status={status} species={species} type={type} />
      </CardInfo>
    </StyledCard>
  );
}
