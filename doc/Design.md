## Challenge

Create challenge        /user/:name/challenges/:challengee
Check for challenges    /user/:name/challenges
Make move               /challenge/:key/:user/:move
Check challenge result  /challenge/:key
Update challenge winner /challenge/:key ???

## Data

Set > challenges
      {challenger}:challenges
      {challengee}:challenges

Hash > {challenger}:{challengee}:{seq}
            >
            key, challenger, challengee, {challenger}, {challengee}, winner
