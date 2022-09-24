import AccountListItem from "./AccountListItem";

function AccountList({accounts}) {
    return (
        <>
            {accounts.map(account => (
                <AccountListItem account={account} key={account.id} />
            ))}
        </>
        
    )
}

export default AccountList;