CREATE DATABASE virtual_arm;

USE virtual_arm;

CREATE TABLE users (
  id int(10) NOT NULL auto_increment,
  user_name VARCHAR(25) DEFAULT '',
  first_name VARCHAR(25) DEFAULT '',
  last_name VARCHAR(25) DEFAULT '',  
  password_hash VARCHAR(80) DEFAULT '',
  is_disabled TINYINT(1) DEFAULT 0,

  PRIMARY KEY (id),
  UNIQUE KEY (user_name)
);