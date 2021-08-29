import ghpages from 'ghpages';

ghpages.publish(
    'public', // path to public directory,
    {
        branch: 'gh-pages',
        repo: 'https://github.com/CobyPear/timer-app.git',
        user: {
            name: 'Coby Sher',
            email: 'pear.coby@gmail.com'
        }
    },
    () => {
        console.log('🧑‍🚀 Deploy complete!');
    }
)