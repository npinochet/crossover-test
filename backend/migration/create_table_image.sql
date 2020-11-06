
create table Images
(
    UUID        varchar(255)              not null,
    Description varchar(255) charset utf8 null,
    Type        varchar(255)              null,
    Size        int                       null,
    constraint Images_UUID_uindex
        unique (UUID)
);

alter table Images
    add primary key (UUID);
